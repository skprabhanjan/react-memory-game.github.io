import React from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import StarInComplete from '@material-ui/icons/StarBorder';
import StarComplete from '@material-ui/icons/Star';
import SaveIcon from '@material-ui/icons/GamepadRounded';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Timer from './Timer';

const styles = {
    card: {
        maxWidth: 250,
        margin: 10,
    },
    media: {
        height: 150,
    },
    startButton: {
        margin: "auto",
        display: "block"
    },

};

let flipResetCount = 0;
let successCount = 0;

interface cardLayoutProps {

}

interface cardLayoutStates {
    cards: number[], firstFlippedImage: string, secondFlippedImage: string,
    progress: any[], startGame: boolean, open: boolean, timerId: number
}


class CardLayout extends React.Component<cardLayoutProps, cardLayoutStates> {
    constructor(props: any) {
        super(props);
        this.state = {
            cards: Array(16).fill(null), firstFlippedImage: "", secondFlippedImage: "",
            progress: Array(8).fill(null), startGame: false, open: false, timerId: 0
        }
    }

    componentDidMount = () => {
        let tempArray: any[] = [];
        this.state.progress.forEach((index) => {
            tempArray.push(<StarInComplete className="center" />);
        });
        this.setState({
            cards: this.generateCardSet(),
            progress: tempArray
        })
    }

    generateCardSet = () => {
        let cardGeneratorArray = Array(16).fill(null);
        let filledNumbers = Array(16).fill(null);
        for (let i = 0; i < 16; i++) {
            let randomNum = Math.floor(Math.random() * 16);
            if (cardGeneratorArray[i] === null) {
                while (filledNumbers[randomNum] !== null) {
                    randomNum = Math.floor(Math.random() * 16);
                }
                cardGeneratorArray[i] = (randomNum + 1);
                filledNumbers[randomNum] = 1;
            }
        }

        return cardGeneratorArray;
    }

    handeFlipImage = (event: any) => {
        this.flipImage(event.target.id);
        if (flipResetCount === 0) {
            flipResetCount++;
            this.setState({
                firstFlippedImage: event.target.id
            })
        }
        else if (flipResetCount === 1) {
            this.setState({
                secondFlippedImage: event.target.id
            }, function (this: any) {
                if (Math.abs(this.state.firstFlippedImage - this.state.secondFlippedImage) !== 8) {
                    const context = this;
                    setTimeout(function () {
                        flipResetCount = 0;
                        context.flipImage(context.state.firstFlippedImage);
                        context.flipImage(context.state.secondFlippedImage);
                        context.setState({
                            firstFlippedImage: "",
                            secondFlippedImage: ""
                        })
                    }, 500);
                }
                else {
                    successCount++;
                    let history: string | null = localStorage.getItem("completedItems");
                    let newValue: string = Math.min(this.state.firstFlippedImage, this.state.secondFlippedImage).toString();
                    let updatedValue: string;
                    if (history === null) {
                        updatedValue = newValue;
                    }
                    else {
                        updatedValue = history + "," + newValue;
                    }
                    localStorage.setItem("completedItems", updatedValue);
                    let tempArray = [];
                    for (let i = 0; i < successCount; i++) {
                        tempArray.push(<StarComplete className="center" />);
                    }

                    for (let i = successCount; i < this.state.progress.length; i++) {
                        tempArray.push(<StarInComplete className="center" />);
                    }

                    flipResetCount = 0;
                    this.setState({
                        firstFlippedImage: "",
                        secondFlippedImage: "",
                        progress: tempArray
                    }, function (this: any) {
                        if (successCount === 8) {
                            this.setState({
                                open: true
                            }, function (this: any) {
                                localStorage.removeItem("completedItems");
                                localStorage.removeItem("timer");
                                clearInterval(this.state.timerId);
                            })
                        }
                    })
                }
            });
        }
    }

    flipImage = (imageId: number) => {
        let imagePath = "/images/image" + imageId + ".jpeg";
        if (imageId > 8) {
            imagePath = "/images/image" + (imageId - 8) + ".jpeg";
        }
        if (document.getElementById(imageId.toString()) !== null) {
            if (!document.getElementById(imageId.toString())!.style.backgroundImage)
                document.getElementById(imageId.toString())!.style.backgroundImage = "url(" + imagePath + ")";
            else
                document.getElementById(imageId.toString())!.style.backgroundImage = "";
        }

    }

    handleContinueGameProgress = (count: number) => {
        let tempArray = [];
        for (let i = 0; i < count; i++) {
            tempArray.push(<StarComplete className="center" />);
        }

        for (let i = count; i < this.state.progress.length; i++) {
            tempArray.push(<StarInComplete className="center" />);
        }
        this.setState({
            progress: tempArray
        });
        successCount = count;

    }
    startGame = () => {
        this.setState({
            startGame: true
        })
    }

    handleClose = () => {
        this.setState({ open: false });
    }

    tryAgain = () => {
        window.location.reload();
    }

    setTimerId = (id: number) => {
        this.setState({
            timerId: id
        })
    }


    render = () => {
        return (
            <div>
                {!this.state.startGame && (
                    <Button variant="contained" size="large" style={styles.startButton} onClick={this.startGame}>
                        Let's Start The Game! &nbsp;&nbsp;
                    <SaveIcon />
                    </Button>
                )}

                {this.state.startGame && (
                    <div id="cardGame">
                        <Timer setTimerId={this.setTimerId} flipImageHelper={this.flipImage} handleContinueGameProgress={this.handleContinueGameProgress} /> <br />
                        {this.state.progress.map(value => {
                            return value;
                        })}
                        <br />
                        {this.state.cards.map((value) => {
                            return (
                                <Card style={styles.card} className="column" onClick={this.handeFlipImage} key={value}>
                                    <CardActionArea>
                                        <CardMedia
                                            style={styles.media}
                                            id={value.toString()}
                                            src="default"
                                        />
                                    </CardActionArea>
                                </Card>
                            )
                        })}
                        <Dialog
                            open={this.state.open}
                            onClose={this.handleClose}
                            aria-labelledby="responsive-dialog-title"
                        >
                            <DialogTitle id="responsive-dialog-title">{"Yayyy!!!!"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Cool , You have completed the Game , Let's see if it was just luck or you got what it takes, Play Again to prove it .
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.tryAgain} color="primary">
                                    Play Again
                         </Button>
                                <Button onClick={this.handleClose} color="primary" autoFocus>
                                    Close
                        </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )}
            </div>
        )
    }
}

export default CardLayout;
