const express = require('express');
const app = express();
app.listen(3001, function () {
    console.log(":3");
});

var scopes = ["ugc-image-upload", "user-read-recently-played", "user-read-playback-state", "user-top-read", "app-remote-control", "playlist-modify-public", "user-modify-playback-state", "playlist-modify-private", "user-follow-modify", "user-read-currently-playing", "user-follow-read", "user-library-modify", "user-read-playback-position", "playlist-read-private", "user-read-email", "user-read-private", "user-library-read", "playlist-read-collaborative", "streaming"];
var showDialog = false;
responseType = "token";

var SpotifyWebApi = require('spotify-web-api-node');

var client_id = "de918b458ff849558318c384625f3614";
var client_secret = "d5325bbc18144aa489a96fe6ef158cef";

//const redirect_uri = "http://35.174.123.227:3001/callback";

//const home_page = "https://tapispotify-8b94d.web.app/";

const home_page = "http://localhost:3000";
const redirect_uri = "http://localhost:3001/callback";

var spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: client_id,
    clientSecret: client_secret
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


app.get("/login", (req, res) => {

    var html = spotifyApi.createAuthorizeURL(scopes, showDialog, responseType);
    res.redirect(html);
});

app.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        console.log(data.body);
        const { access_token, refresh_token, expires_in } = data.body;
        console.log(expires_in);

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
    } catch (err) {
        //res.redirect('/#/error/invalid token');
        RefreshToken();
        
    }
    res.redirect(home_page);
});


function RefreshToken(){
    spotifyApi.refreshAccessToken().then(
        function(data) {
          console.log('The access token has been refreshed!');

          // Save the access token so that it's used in future calls
          spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
          console.log('Could not refresh access token', err);
        }
    );      
}



// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-profile
app.get("/me", async (req, res) => {
    spotifyApi.getMe()
        .then(function (data) {
            const data_send = {
                username: data.body.display_name,
                img: data.body.images[0].url,
            }
            res.send(data_send);

        }), function (err) {
            console.log("Error", err);
        }
});

// https://developer.spotify.com/documentation/web-api/reference/#/operations/get-track
app.get("/toptracks", (req, res) => {
    spotifyApi.getMyTopTracks({
        limit: req.query.limit,
        time_range: req.query.time_range
    })
        .then(data => {
            const data_send = data.body.items.map(track => {

                const artists = track.artists.map(artist => {

                    return {
                        name: artist.name,
                        url: artist.external_urls,
                        id: artist.id
                    };
                })
                return {
                    name: track.name,
                    img: track.album.images[0].url,
                    id: track.id,
                    artists
                };
            })
            res.send(data_send);

        }, () => {
            console.log("Something went wrong!", err);
        });
});

app.get("/features", (req, res) => {
    spotifyApi.getAudioFeaturesForTracks(req.query.tracks)

        .then(data => {

            const data_send = {
                danceability: 0,
                acousticness: 0,
                energy: 0,
                instrumentalness: 0,
                liveness: 0,
                loudness: 0,
                speechiness: 0,
                tempo: 0,
                valence: 0
            };

            data.body.audio_features.forEach(i => {
                data_send.danceability += i.danceability;
                data_send.acousticness += i.acousticness;
                data_send.energy += i.energy;
                data_send.instrumentalness += i.instrumentalness;
                data_send.liveness += i.liveness;
                data_send.loudness += i.loudness;
                data_send.speechiness += i.speechiness;
                data_send.tempo += i.tempo;
                data_send.valence += i.valence;
            })

            Object.keys(data_send).forEach(i => {
                data_send[i] = (data_send[i] / data.body.audio_features.length).toFixed(2);
            });

            res.send(data_send);
        }, () => {
            console.log("Something went wrong!", err);
        });
});
