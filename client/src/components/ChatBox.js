import React from 'react'
import ChatForm from './ChatForm'
import ChatList from './ChatList'
import axios from 'axios'


const request = axios.create({
    baseURL: 'http://localhost:3001/api/',
    timeout: 1000,
    headers: { 'token': 'kwkakwakwk' }
});


export default class ChatBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: [] }
        this.addChat = this.addChat.bind(this)
        this.removeChat = this.removeChat.bind(this)
        this.resendChat = this.resendChat.bind(this)
    }

    componentDidMount() {
        request.get('chats').then(data => {
            const completeData = data.data.map(item => {
                item.sent = true
                return item
            })

            this.setState({ data: completeData })
        })
            .catch(err => {
                console.log(err)
            })
    }
    addChat(name, message) {
        const id = Date.now()
        this.setState((state, props) => ({
            data: [...state.data, { id, message, name, sent: true }]
        }))
        request.post('chats', {
            id,
            name,
            message
        })
            .then(data =>
                console.log(data)
            )
            .catch(err => {
                console.log(err)
                this.setState((state, props) => ({
                    data: state.data.map(item => {
                        if (item.id === id) {
                            item.sent = false
                        }
                        return item
                    })
                }))
            })
    }
    removeChat(id) {
        this.setState((state, props) => ({
            data: state.data.filter(item => item.id !== id)
        }))
        request.delete(`chats/${id}`).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err)
        })
    }
    resendChat(id, name, message) {
        request.post('chats', {
            id,
            name,
            message
        })
            .then(data => {
                console.log(data)
                this.setState((state, props) => ({
                    data: state.data.map(item => {
                        if (item.id === id) {
                            item.sent = true
                        }
                        return item
                    })
                }))
            })
            .catch(err => {
                console.log(err)

            })
    }
    render() {
        return (

            <div className='chatBox container-fluid'>
                <h1> REACT <span>CHAT.</span> </h1>
                <div className='row header'>
                    <div className="col-sm">

                    </div>
                </div>
                <div className='whiteBox container'>
                    <div className='col-sm'>
                        <ChatList data={this.state.data} remove={this.removeChat} resend={this.resendChat} />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm'>
                        <ChatForm add={this.addChat} />
                    </div>

                </div>

            </div>


        )
    }
}