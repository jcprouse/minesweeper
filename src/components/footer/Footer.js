import React from 'react';

function Footer(props){

    return (
        <React.Fragment>
            {props.winner ? "Congratulations!" : ""}
            {props.lose ? "You lost!" : ""}
        </React.Fragment>
    );
}


export default Footer;