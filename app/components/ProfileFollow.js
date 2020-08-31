import React, { useEffect, useState, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"

function ProfileFollow() {
    const appState = useContext(StateContext)
    const { username, action } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [follows, setFollows] = useState([])

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        async function fetchFollows() {
            try {
                const response = await Axios.get(`/profile/${username}/${action}`, { cancelToken: ourRequest.token })
                setFollows(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("There was a problem.")
            }
        }
        fetchFollows()
        return () => {
            ourRequest.cancel()
        }
    }, [username, action])

    if (isLoading) return <LoadingDotsIcon />

    return (
        <div className="list-group">
            {follows.length > 0 &&
                follows.map((follower, index) => {
                    return (
                        <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                        </Link>
                    )
                })}
            {follows.length == 0 && appState.user.username == username && action == "following" && <p className="text-center">You aren&rsquo;t following anyone yet.</p>}
            {follows.length == 0 && appState.user.username != username && action == "following" && <p className="text-center">This user isn&rsquo;t following anyone yet.</p>}
            {follows.length == 0 && appState.user.username == username && action == "followers" && <p className="text-center">You aren&rsquo;t followed by anyone yet.</p>}
            {follows.length == 0 && appState.user.username != username && action == "followers" && <p className="text-center">This user isn&rsquo;t followed by anyone yet.</p>}
        </div>
    )
}

export default ProfileFollow
