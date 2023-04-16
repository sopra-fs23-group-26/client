import "styles/views/Select.scss";

const Select = () =>{
    return(
        <div class="select">
            <h2 class="select title">Undercover</h2>

            <button class="select button">Play!</button>

            <button class="select button" style={{"background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
            }}>Back</button>

            <p class="select box">game rules:<br/>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/><br/>
                score rules:<br/>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>


        </div>
    );

}

export default Select;