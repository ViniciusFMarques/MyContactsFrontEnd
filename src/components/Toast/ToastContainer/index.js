import ToastMessage from "../ToastMessage";
import { Container } from "./styles";
import { useEffect } from "react";
import { toastEventManager } from "../../../utils/toast";
import useAnimatedList from "../../../hooks/useAnimatedList";

export default function ToastContainer(){

  const {
    handleRemoveItem,
    setItems: setMessages,
    renderList
  } = useAnimatedList()

  useEffect(() => {
    function handleAddToast({type, text, duration}) {
        setMessages((prevState) => [
          ...prevState,
          {id: Math.random(), type, text, duration}
    ])}

    toastEventManager.on('addtoast', handleAddToast);

    return () => {
      toastEventManager.removeListener('addtoast', handleAddToast);
    }
  }, [setMessages]);


  return (
    <Container>
      {renderList((message, {isLeaving, animatedRef}) => (
        <ToastMessage
          key={message.id}
          message={message}
          onRemoveMessage={handleRemoveItem}
          isLeaving={isLeaving}
          animatedRef={animatedRef}
        />
      ))}
    </Container>
  )
}
