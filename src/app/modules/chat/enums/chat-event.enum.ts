export enum ChatEvent {
  UNAUTHORIZED                    = "unauthorized",
  ONLINE_EVENT                    = "online",
  DISCONNECT_EVENT                = "offline",
  ADD_TO_FRIENDS                  = "add_to_friend",
  REMOVE_FROM_FRIENDS             = "remove_from_friends",
  TRANSACTION_SUCCESSFUL          = "transaction_successful",
  SEND_MESSAGE_TO_SERVER          = "send_message_to_server",
  SEND_MESSAGE_TO_CLIENT          = "send_message_to_client",
  MESSAGE_MAKE_SEEN_TO_SERVER     = "message_make_seen_to_server",
  SEND_UNSEEN_MESSAGES_TO_CLIENT  = "send_unseen_messages_to_client",
  FETCH_UNSEEN_MESSAGES_TO_SERVER = "fetch_unseen_messages_to_server"
}