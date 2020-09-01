import React, { useEffect } from "react"

function FlashMessages(props) {
    let alertType
    return (
        <div className="floating-alerts">
            {props.messages.map((msg, index) => {
                switch (msg.type) {
                    case "success":
                        alertType = "alert-success"
                        break
                    case "danger":
                        alertType = "alert-danger"
                        break
                    case "warning":
                        alertType = "alert-warning"
                        break
                    default:
                        alertType = "alert-success"
                        break
                }
                return (
                    <div key={index} className={"alert text-center floating-alert shadow-sm " + alertType}>
                        {msg.value}
                    </div>
                )
            })}
        </div>
    )
}

export default FlashMessages
