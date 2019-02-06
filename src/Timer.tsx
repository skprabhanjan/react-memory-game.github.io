import React from 'react';
import './App.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';



const styles = {
    timer: {
        fontSize: 50,
        textAlign: "center" as "center"
    }
}

interface TimerProps {
    setTimerId: any;
    flipImageHelper: any;
    handleContinueGameProgress: any
}

interface TimerStates {
    secondsRemaining: number,
    colorToBeShown: string,
    open: boolean,
    gameContinuePopUp: boolean
}

class Timer extends React.Component<TimerProps, TimerStates> {

    constructor(props: any) {
        super(props);
        this.state = {
            secondsRemaining: 30, colorToBeShown: "black", open: false,
            gameContinuePopUp: false
        };
    }

    componentDidMount = () => {
        if (!localStorage.getItem("timer")) {
            localStorage.setItem("timer", this.state.secondsRemaining.toString());
            this.startTimer();
        }
        else {
            this.setState({
                gameContinuePopUp: true
            })
        }
    }

    startTimer = () => {
        const context = this;
        let timer = setInterval(function () {
            if (context.state.secondsRemaining > 0) {
                if (context.state.secondsRemaining <= 11) {
                    context.setState({
                        colorToBeShown: "red"
                    })
                }
                context.setState({
                    secondsRemaining: context.state.secondsRemaining - 1
                }, function () {
                    localStorage.setItem("timer", context.state.secondsRemaining.toString());
                })
            }
            else {
                clearInterval(timer);
                localStorage.removeItem("timer");
                context.setState({
                    open: true
                })
            }
        }, 1000);
        this.props.setTimerId(timer);
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    tryAgain = () => {
        window.location.reload();
    }

    startNewGame = () => {
        this.setState({
            secondsRemaining: this.state.secondsRemaining,
            gameContinuePopUp: false
        }, function (this: any) {
            localStorage.removeItem("completedItems");
            this.startTimer();
        })
    }

    contiueGame = () => {
        this.setState({
            secondsRemaining: +localStorage.getItem("timer")!,
            gameContinuePopUp: false
        }, function (this: any) {
            let completedItems: string | null = localStorage.getItem('completedItems');
            if (completedItems !== null) {
                (completedItems.split(',')).forEach(element => {
                    this.props.flipImageHelper(+element);
                    this.props.flipImageHelper(+element + 8);
                });
                this.props.handleContinueGameProgress(completedItems.split(',').length);
            }
            this.startTimer();
        })
    }

    render() {
        return (

            <div style={styles.timer}>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Arghhhhhhhh!!!!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The Time is up and you could not complete the Game! Dont Lose Hope, Try Again Now.
                            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.tryAgain} color="primary">
                            Try Again
                         </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.gameContinuePopUp}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Game in Progress!!!!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            There is already a game in progress , Do you wish you continue ?
                            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.contiueGame} color="primary">
                            Yes
                         </Button>
                        <Button onClick={this.startNewGame} color="primary" autoFocus>
                            Nope
                        </Button>
                    </DialogActions>
                </Dialog>
                <div style={{ color: this.state.colorToBeShown }}> {this.state.secondsRemaining} </div>
            </div>
        );
    }
}

export default Timer;
