import React, { Component } from 'react';

import ChatUI from './ChatUI';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { DeviceWifiTethering } from 'material-ui/svg-icons';

const theme = createMuiTheme({
    palette: {
        primary: grey
    },
    typography: {
        useNextVariants: true,
    }
});

const styles = (theme) => ({
    bottomNavigation: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },

    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
});


class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const alignItems = 'center';
        const direction = 'row';
        const justify = 'center';
        
        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit" className={ classes.grow }>Simple Chat</Typography>
                    </Toolbar>
                </AppBar>
                <Grid
                    container
                    alignItems={alignItems}
                    direction={direction}
                    justify={justify}
                    className={classes.root}
                    spacing={24}
                >
                    <Grid item xs={6}>
                        <Paper className={classes.root} elevation={2}>
                            <ChatUI
                                updateField={ this.props.updateField }
                                initRoomState={ this.props.initRoomState }
                                roomid={ this.props.roomid }
                                nickname={ this.props.nickname }
                                button_label={ this.props.button_label }
                                readonly={ this.props.readonly }
                                csrf={ this.props.csrf }
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <BottomNavigation
                    className={ classes.bottomNavigation }
                    showLabels
                >
                </BottomNavigation>
            </div>
        );
                

    }
}

export default withStyles(styles)(App);