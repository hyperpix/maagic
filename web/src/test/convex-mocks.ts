export const MOCK_CONVERSATIONS = [
  { _id: "conv1", _creationTime: 1704067200000, visitorId: "visitor1" },
  { _id: "conv2", _creationTime: 1704153600000, visitorId: "visitor2" },
];

export const MOCK_MESSAGES = [
  { _id: "msg1", _creationTime: 1704067200000, conversationId: "conv1", sender: "visitor", content: "Hello" },
  { _id: "msg2", _creationTime: 1704067260000, conversationId: "conv1", sender: "agent", content: "Hi there" },
  { _id: "msg3", _creationTime: 1704153600000, conversationId: "conv2", sender: "visitor", content: "Help" },
];
