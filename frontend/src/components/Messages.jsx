import { useMemo } from "react"
import MessageBox from "./MessageBox"

const Messages = (props) => {
  const { messages, lastMessage } = props
  return (
    messages.map((item, i) => {
      const date = new Date(item.createdAt)
      const parsed = date.toLocaleString()
      const showTimestamp = i === messages.length - 1 ||
      new Date(messages[i].createdAt) - new Date(messages[i + 1]?.createdAt) < -60000 || messages[i + 1].createdBy !== messages[i].createdBy
      return (
      <MessageBox
        key={item.createdAt}
        item={item} 
        parsed={parsed}
        showTimestamp={showTimestamp}
        lastMessage={i === 0 ? lastMessage : null}
      />
      
    )})
  )
}

export default Messages