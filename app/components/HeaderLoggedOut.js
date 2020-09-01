import React, { useEffect, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"

function HeaderLoggedOut(props) {
    const appDispatch = useContext(DispatchContext)

    const initialState = {
        username: {
            value: "",
            hasErrors: false
            // message: ""
        },
        password: {
            value: "",
            hasErrors: false
            // message: ""
        },
        submitCount: 0
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "isUsernameEntered":
                draft.username.hasErrors = false
                draft.username.value = action.value
                if (!draft.username.value) {
                    draft.username.hasErrors = true
                    // draft.username.message = "Please enter your username"
                }
                return
            case "isPasswordEntered":
                draft.password.hasErrors = false
                draft.password.value = action.value
                if (!draft.password.value) {
                    draft.password.hasErrors = true
                    // draft.password.message = "Please enter your password"
                }
                return
            case "submitForm":
                if (!draft.username.hasErrors && !draft.password.hasErrors) {
                    draft.submitCount++
                }
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.submitCount) {
            //Send axios request here
            const ourRequest = Axios.CancelToken.source()
            async function fetchResults() {
                try {
                    const response = await Axios.post("/login", { username: state.username.value, password: state.password.value }, { CancelToken: ourRequest.token })
                    if (response.data) {
                        appDispatch({ type: "login", data: response.data })
                        appDispatch({ type: "flashMessage", value: "You have successfully logged in.", messageType: "success" })
                    } else {
                        console.log("Incorrect username/password")
                        appDispatch({ type: "flashMessage", value: "Invalid username/password.", messageType: "danger" })
                    }
                } catch (e) {
                    console.log("There was an error - " + e.response.data)
                }
            }
            fetchResults()
            return () => ourRequest.cancel()
        }
    }, [state.submitCount])

    async function handleSubmit(e) {
        e.preventDefault()
        dispatch({ type: "isUsernameEntered", value: state.username.value })
        dispatch({ type: "isPasswordEntered", value: state.password.value })
        dispatch({ type: "submitForm" })
    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => dispatch({ type: "isUsernameEntered", value: e.target.value })} name="username" className={"form-control form-control-sm input-dark " + (state.username.hasErrors ? "is-invalid" : "")} type="text" placeholder="Username" autoComplete="off" />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => dispatch({ type: "isPasswordEntered", value: e.target.value })} name="password" className={"form-control form-control-sm input-dark " + (state.password.hasErrors ? "is-invalid" : "")} type="password" placeholder="Password" />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoggedOut
