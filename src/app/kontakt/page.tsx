"use client"
import { FormEventHandler, useEffect, useId, useState } from "react"
import useIsMounted from "../../hooks/useIsMounted"
import Website, { Maybe } from "../../typings"

const Contact = () => {
    const isMountedRef = useIsMounted()
    const [requestSent, setRequestSent] = useState(false)
    const [response, setResponse] = useState<Maybe<boolean>>(undefined)
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [phone, setPhone] = useState("")
    const nameId = useId()
    const phoneId = useId()
    const mailId = useId()

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setRequestSent(true)
    }

    const resetSendButton = () => {
        setRequestSent(false)
        setResponse(undefined)
    }

    useEffect(() => {
        if (requestSent) {
            fetch("/api/contact", {
                headers: new Headers({
                    contentType: "application/json",
                }),
                method: "POST",
                body: JSON.stringify({
                    description,
                    mail,
                    name,
                    phone,
                } as Website.Api.ContactRequestBody),
            })
                .then((res) => {
                    if (isMountedRef.current) {
                        setRequestSent(false)
                        setResponse(res.status === 200 ? true : false)
                    }
                })
                .catch(() => {
                    if (isMountedRef.current) {
                        setRequestSent(false)
                        setResponse(false)
                    }
                })
                .finally(() => {
                    setTimeout(() => {
                        if (isMountedRef.current) {
                            resetSendButton()
                        }
                    }, 2000)
                })
        }
    }, [requestSent])

    return <></>
}

export default Contact
