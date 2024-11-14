import Pusher from 'pusher-js/react-native';

const pusher = new Pusher('6a260fa3e4660736f2dc', {
  cluster: 'ap1',
  encrypted: true,
});

export default pusher;
