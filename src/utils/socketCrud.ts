const addUser = (clients, userID, socketId) => {
  if (clients[userID]) {
    clients[userID].push(socketId);
  } else {
    clients[userID] = [socketId];
  }
}

const removeUser = (clients, userID, socketId) => {
  if (clients[userID]) {
    clients[userID] = clients[userID].filter(e => e !== socketId);
  }

  if (clients[userID]) {
    if(clients[userID].length === 0 ) {
      delete clients[userID];
    }
  }
}

export { addUser, removeUser }