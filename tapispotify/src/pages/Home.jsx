import React, { useEffect, useState } from "react";


const base_url = "http://localhost:3001";

function Home() {
    const [tracks, setTracks] = useState();
    const [features, setFeatures] = useState();
    const [userInfo, setUserInfo] = useState();
    const [isLoading, setIsLoading] = useState();
    const [selectedButton, setSelectedButton] = useState();

    async function getUserInfo() {
        const response = await fetch(`${base_url}/me`);
        const data = await response.json();
        setUserInfo(data);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (tracks && features) {
            setIsLoading(false);
        }
    }, [tracks, features]);

    function buttonHandler(event) {
        if (event.target.value !== selectedButton) {
            topTracks(event.target.value);
            setSelectedButton(event.target.value);
            setIsLoading(true);
        }
    };

    async function topTracks(time_range) {
        var url = `${base_url}/toptracks?limit=${50}&time_range=${time_range}`;
        const response = await fetch(url);
        const data = await response.json();

        setTracks(data);

        var tracks = data.map(track => {
            return track.id;
        });
        trackFeatures(tracks)
    }

    async function trackFeatures(track_ids) {
        let url = `${base_url}/features?`;
        track_ids.forEach(id => {
            url += "tracks=" + id + "&"
        });
        const response = await fetch(url);
        const data = await response.json();
        setFeatures(data);
    }

    return (
        <React.Fragment>
            <header className="container">
                <p id="logo" className='box'>TAPISPOTIFY</p>

                <div className='button-group box'>
                    <button onClick={buttonHandler} value="short_term">short term</button> |
                    <button onClick={buttonHandler} value="medium_term">medium term</button> |
                    <button onClick={buttonHandler} value="long_term">long term</button>
                </div>

                <React.Fragment>
                    {
                        userInfo && <div className='user-data box'>
                            <img src={userInfo.img} width="50px" />
                            <p>{userInfo.username}</p>
                        </div>
                    }
                </React.Fragment>

            </header>

            {
                !isLoading && <React.Fragment>
                    <div className='features'>
                        {
                            features &&
                            <div>
                                {
                                    features && <div className='features'>
                                        {
                                            Object.keys(features).map(i => {
                                                return <div key={i}>{i}: {features[i]}</div>
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <div className='tracks'>
                        {
                            tracks && tracks.map(track => {
                                return <div key={track.id}>
                                    <img width="200px" src={track.img} />
                                    <div>
                                        <p>{track.name}</p>
                                        {
                                            track.artists.map(artist => {
                                                return <p key={artist.id}>{artist.name}</p>
                                            })
                                        }
                                    </div>

                                </div>
                            })
                        }
                    </div>
                </React.Fragment>
            }

            {
                isLoading && <React.Fragment>
                    <div className="features" />
                    <div className="tracks">
                        LOADING
                    </div>
                </React.Fragment>
            }
        </React.Fragment>
    )

}

export default Home;