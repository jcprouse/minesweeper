import React from 'react';

function Footer(props) {
    return (
        <span className="footer">
            {props.winner ? "Congratulations, you won!  Click New Game to try again." : ""}
            {props.lose ? "Game Over! Click New Game to try again." : ""}
        </span>
    );
}
export default Footer;