import React, { useState } from "react";

import axios from "axios";
import "./FlashCardGenerator.css";

const FlashcardGenerator = () => {
    const [textContent, setTextContent] = useState("");
    const [flashcards, setFlashcards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateFlashcards = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:5005/api", {
                textContent,
            });
            setFlashcards(response.data);
            setCurrentCardIndex(0);
            setFeedback({ message: "", className: "" });
        } catch (error) {
            console.error("Error generating flashcards:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setFeedback({
                    message: error.response.data.message,
                    className: "incorrect",
                });
            } else {
                setFeedback({
                    message: "An unexpected error occurred. Please try again.",
                    className: "incorrect",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (selectedOption, correctAnswer) => {
        if (selectedOption === correctAnswer) {
            setFeedback({
                message: "Correct! Well done.",
                className: "correct",
            });
        } else {
            setFeedback({
                message: "Incorrect. Try again.",
                className: "incorrect",
            });
        }

        setTimeout(() => {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
            setFeedback({ message: "", className: "" });
        }, 1000);
    };

    return (
        <div>
            <h1>Clinical Flashcard Creator for Medical Students</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px",
                }}
            >
                <textarea
                    rows="5"
                    cols="50"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter text content..."
                />
                <button onClick={handleGenerateFlashcards}>
                    Generate Flashcards
                </button>
            </div>
            {isLoading ? (
                <div className="loading">
                    Generating flashcards, please wait...
                </div>
            ) : (
                feedback.message && (
                    <div className={`feedback ${feedback.className}`}>
                        {feedback.message}
                    </div>
                )
            )}
            <div className="flashcard-container">
                {flashcards.length > 0 &&
                    currentCardIndex < flashcards.length && (
                        <div className="flashcard">
                            <strong>Question:</strong>{" "}
                            {flashcards[currentCardIndex].question}
                            <div className="options">
                                <strong>Options:</strong>
                                <ul>
                                    {Object.entries(
                                        flashcards[currentCardIndex].options
                                    ).map(([key, value]) => (
                                        <li key={key}>
                                            <button
                                                onClick={() =>
                                                    handleOptionClick(
                                                        key,
                                                        flashcards[
                                                            currentCardIndex
                                                        ].correctAnswer
                                                    )
                                                }
                                                className="option-button"
                                            >
                                                {key}. {value}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                {flashcards.length > 0 &&
                    currentCardIndex >= flashcards.length && (
                        <div
                            style={{
                                margin: "20px 0",
                                fontSize: "1.2em",
                                color: "blue",
                                fontWeight: "bold",
                            }}
                        >
                            You've completed the quiz!
                        </div>
                    )}
            </div>
        </div>
    );
};

export default FlashcardGenerator;
