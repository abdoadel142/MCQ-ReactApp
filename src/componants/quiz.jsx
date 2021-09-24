import React, {Component} from 'react';
import Question from './question/question';
import Answer from './answer/Answer';
import './quiz.css';

export default class Quiz extends Component {

    // initiating the local state
    state = {
        quiestions: {},
        answers: {},
        correctAnswers: {},
        correctAnswer: 0,
        clickedAnswer: 0,
        step: 1,
        score: 0
    }
    componentDidMount() {
        this.questionList();
        this.answersList();
      }
    
      questionList() {
        fetch('http://localhost:4000/users/Questions')
          .then(({ results }) => this.setState({ quiestions: results.question }));
      }
      answersList() {
        fetch('http://localhost:4000/users/answers')
          .then(({ results }) => this.setState({ answers: results.answers }));
      }
      correctAnswersList() {
        fetch('http://localhost:4000/users/correctAnswers')
          .then(({ results }) => this.setState({ answers: results.answers }));
      }
    // the method that checks the correct answer
    checkAnswer = answer => {
        const { correctAnswers, step, score } = this.state;
        if(answer === correctAnswers[step]){
            this.setState({
                score: score + 1,
                correctAnswer: correctAnswers[step],
                clickedAnswer: answer
            });
        }else{
            this.setState({
                correctAnswer: 0,
                clickedAnswer: answer
            });
        }
    }

    // method to move to the next question
    nextStep = (step) => {
        this.setState({
            step: step + 1,
            correctAnswer: 0,
            clickedAnswer: 0
        });
    }

    render(){
        let { quiestions, answers, correctAnswer, clickedAnswer, step, score } = this.state;
        return(
            <div className="Content">
                {step <= Object.keys(quiestions).length ? 
                    (<>
                        <Question
                            question={quiestions[step]}
                        />
                        <Answer
                            answer={answers[step]}
                            step={step}
                            checkAnswer={this.checkAnswer}
                            correctAnswer={correctAnswer}
                            clickedAnswer={clickedAnswer}
                        />
                        <button
                        className="NextStep"
                        disabled={
                            clickedAnswer && Object.keys(quiestions).length >= step
                            ? false : true
                        }
                        onClick={() => this.nextStep(step)}>Next</button>
                    </>) : (
                        <div className="finalPage">
                            <h1>You have completed the quiz!</h1>
                            <p>Your score is: {score} of {Object.keys(quiestions).length}</p>
                            <p>Thank you!</p>
                        </div>
                    )
                }
            </div>
        );
    }
}