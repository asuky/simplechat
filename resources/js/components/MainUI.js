import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
//import { classExpression } from 'babel-types';

import grey from '@material-ui/core/colors/grey';

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

    textFieldColor: {
        color: "#ffffff"
    },

    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
});


class MainUI extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar position="static" color="primary">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit" className={ classes.grow }>Simple Chat</Typography>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={24}>
                    <Grid item xs>
                        <Paper className={classes.root} elevation={2}>
                        <Typography variant="h4" component="h2">Simple Chat</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
                /*
                <BottomNavigation
                    className={ classes.bottomNavigation }
                    showLabels
                >
                </BottomNavigation>*/
    }
}

export default withStyles(styles)(MainUI);