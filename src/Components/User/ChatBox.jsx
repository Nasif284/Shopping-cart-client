import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ArrowUp, Bot, User } from "lucide-react";
import { useSendMessageMutation } from "../../Store/Api/user/auth";
import { typing } from "../../Assets";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [sendMessageApi] = useSendMessageMutation();
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMsg = { sender: "user", text: input };
    setMessages((prev) => [
      ...prev,
      newUserMsg,
      { sender: "bot", text: "Loading..." },
    ]);

    try {
      const response = await sendMessageApi({ query: input }).unwrap();
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { sender: "bot", text: response.reply }];
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          { sender: "bot", text: "Error contacting server ❌" },
        ];
      });
    }
    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleScroll = () => {
    if (chatRef.current) {
      setShowScrollTop(chatRef.current.scrollTop > 150);
    }
  };

  const scrollToTop = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="floating-button"
            initial={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#ff5252] rounded-full blur-xl opacity-30 animate-pulse"></div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsOpen(true)}
              className="relative p-4 rounded-full bg-gradient-to-br from-[#ff5252] to-[#e04848] shadow-xl text-white hover:shadow-2xl transition-shadow duration-300"
            >
              <MessageCircle size={28} />

              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-96 h-[520px] bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-100"
          >

            <div className="flex justify-between items-center bg-gradient-to-r from-[#ff5252] to-[#e04848] text-white px-6 py-4">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot size={20} />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Chat Assistant</h2>
                  <p className="text-xs text-white/80">Online</p>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div
              ref={chatRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-3"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex items-end space-x-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ff5252] to-[#e04848] rounded-full flex items-center justify-center mb-1 shadow-sm">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-[#ff5252] to-[#e04848] text-white rounded-br-md"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                    }`}
                  >
                    {msg.text === "Loading..." ? (
                      <div className="flex items-center space-x-2">
                        <img className="w-8 h-8" src={typing} alt="Typing..." />
                        <span className="text-sm text-gray-500">Typing...</span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mb-1 shadow-sm">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>


            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollToTop}
                  className="absolute bottom-20 right-4 bg-gradient-to-br from-[#ff5252] to-[#e04848] p-2 rounded-full shadow-lg text-white"
                >
                  <ArrowUp size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-2 border border-gray-200">
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:outline-none"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-2 bg-gradient-to-br from-[#ff5252] to-[#e04848] text-white rounded-xl shadow-sm hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
