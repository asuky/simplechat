import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    dense: {
      marginTop: 16,
    },
    menu: {
      width: 200,
    },
    button: {
        textTransform: 'none',
        padding: '6px, 12px'
    }
  });

class ChatUI extends Component {

    constructor(props) {
        super(props);
        console.log(this.props);
    }
    onRoomIdChange(event) {
        console.log(event);
        this.props.updateField("roomid", event.target.value);
    }

    onNicknameChange(event) {
        this.props.updateField("nickname", event.target.value);
    }

    onJoinClick(event) {
        this.props.initRoomState(this.props.roomid, this.props.nickname, this.props.csrf);
    }

    render() {
        const { classes } = this.props;
        return(
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="outlined-name"
                    label="Room ID"
                    className={classes.textField}
                    onChange={ (e) => this.onRoomIdChange(e) }
                    margin="normal"
                    variant="filled"
                    InputProps={{ readOnly: this.props.readonly }}
                />
                <TextField
                    id="outlined-name"
                    label="Nickname"
                    className={classes.textField}
                    onChange={ (e) => this.onNicknameChange(e) }
                    margin="normal"
                    variant="filled"
                    InputProps={{ readOnly: this.props.readonly }}
                />
                <Button 
                    variant="contained"
                    className={classes.button}
                    disabled={ this.props.readonly }
                    onClick={ (e) => this.onJoinClick(e) }
                >
                    { this.props.button_label }
                </Button>
            </form>
        );
    }
}

export default withStyles(styles)(ChatUI);