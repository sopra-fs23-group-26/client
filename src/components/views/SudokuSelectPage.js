import {useHistory} from "react-router-dom";

const SudokuSelectPage = () => {
    const history = useHistory();
    let id = localStorage.getItem('id')
    return(
        <div className="select">
            <h2 className="select title">Sudoku</h2>

            <button className="select button"
            onClick={() => history.push(`/SudokuGame/${id}`)}>Play!</button>

            <button className="select button" style={{"background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
            }} onClick={() => history.push('/platform')}>Back</button>

            <p className="select box">
                Game rules:<br/><br/>
                1. A 9×9 square must be filled in with numbers from 1-9 with no repeated numbers in each line, horizontally or vertically. And there are 3×3 squares marked out in the grid, and each of these squares can't have any repeat numbers either.
                <br/><br/>
                2. When you solve the puzzle, you would gain 4 points.
            </p>
        </div>
    );
}

export default SudokuSelectPage;