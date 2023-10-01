// "use client"

// import React, { HTMLAttributes, useEffect } from "react"
// import ReactDOM from "react-dom"
// import { usePopper } from "react-popper"

// export interface PopUpProps extends HTMLAttributes<HTMLDivElement> {
//     popUp: React.ReactNode
//     // popUpLocation: "top" | "bottom"
// }

// export default function PopUp({ children, popUp, ...rest }: PopUpProps) {
//     const [referenceElement, setReferenceElement] = React.useState(null)
//     const [popperElement, setPopperElement] = React.useState(null)
//     const { styles, attributes } = usePopper(referenceElement, popperElement)

//     useEffect(() => {
//         setReferenceElement(typeof children === "object" && children !== null ? children : undefined)
//     }, [children])

//     return (
//         <>
//         {children}
//         {ReactDOM.createPortal(
//         <div
//             ref={setPopperElement}
//             {...rest}
//             style={styles.popper}
//             {...attributes.popper}
//         >
//             {popUp}
//         </div>,
//         document.body,
//     )}
//         </>
//     )
// }
