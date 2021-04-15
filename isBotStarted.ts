import type { Store } from 'vuex'

let waitAfterStart = false;

const url = process.env.isNuxtDev ? 'http://localhost:20000/health' : '/health';

function isBotStarted(store: Store<any>) {
  return new Promise(resolve => {
    const check = () => {
      store.commit('setLoadingMsg', 'Connecting to bot.');
      console.log('Checking bot on ' + url);
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        }).then(() => {
          if (!waitAfterStart) {
            console.log('Bot is started, continue');
            resolve(true);
          } else {
            store.commit('setLoadingMsg', '... registering sockets ...');
            console.log('Bot is started, registering sockets');
            setTimeout(() => {
              console.log('Bot is started, waiting to full bot load');
              store.commit('setLoadingMsg', '... waiting to full bot load ...');
              setTimeout(() => {
                console.log('Bot is started, continue');
                resolve(true);
              }, 5000);
            }, 5000);
          }
        }).catch(() => {
          store.commit('setLoadingMsg', 'Cannot connect to bot.');
          console.log('Bot not started yet, waiting');
          waitAfterStart = true;
          setTimeout(() => check(), 5000);
        });
    };
    check();
  });
}

export { isBotStarted };