const delugeUrl = process.env.NEXT_PUBLIC_DELUGE_URL || 'http://localhost:8112/json';
const delugePath = process.env.NEXT_PUBLIC_DELUGE_PATH || 'json';
const password = process.env.NEXT_PUBLIC_DELUGE_PASS || 'deluge';
const deluge = require('./delugeApi')(delugeUrl, password);

const connect = async () => {
  deluge.isConnected(function (err: string, connected: boolean) {
    if (err || !connected) {
      deluge.getHosts(function (err: string, result: any) {
        if (err) { console.error(err); return }
        deluge.connect(result[0].id);
      })
    }
  })
}

const addTorrent = async (url: string) => {
  connect();
  deluge.add(url, delugePath, (err: any, result: any) => {
    if (err) { console.error(err); }
  })
}

export { addTorrent }
