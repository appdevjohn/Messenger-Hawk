import Messages from './containers/Messages/Messages';

const dummyProps = {
    highlightId: '1',
    senders: [
        {
            id: '1',
            name: 'John Doe',
            img: 'https://dummyimage.com/128/f2efea/000000.png'
        },
        {
            id: '2',
            name: 'Jane Doe',
            img: 'https://dummyimage.com/128/f2efea/000000.png'
        }
    ]
}

function App() {
    return (
        <div>
            <Messages
                highlightId={dummyProps.highlightId}
                senders={dummyProps.senders} />
        </div>
    );
}

export default App;
