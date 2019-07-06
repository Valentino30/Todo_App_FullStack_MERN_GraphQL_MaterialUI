import React from 'react';
import TextField from '@material-ui/core/TextField';

class CreateTodo extends React.Component {

    state = {
        text: ''
    }

    onChangeText = e => {
        this.setState({
            text: e.target.value
        })
    }

    onEnter = e => {
        if (e.key === 'Enter') {
            this.props.submit(this.state.text);
        }
    }

    render() {
        return(
        <TextField
            label="Add todo"
            margin="auto"
            fullWidth
            value={this.state.text}
            onChange={this.onChangeText}
            onKeyDown={this.onEnter}
        />
        );
    }
}

export default CreateTodo;
