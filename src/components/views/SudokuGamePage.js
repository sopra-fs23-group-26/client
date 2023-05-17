import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import "styles/views/GameSudoku.scss";

const SudokuGamePage = () => {
  let id = localStorage.getItem('id')
  const history = useHistory();
  const [puzzleArray, setPuzzleArray] = useState([]);
  const [copyArray, setCopyArray] = useState([]);
  const [edit, setEdit] = useState(false);
  const [requiredDifficulty, setRequiredDifficulty] = useState("Medium");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/sudoku/create/${requiredDifficulty}`);
        const puzzle = response.data;
        setPuzzleArray(puzzle.map(row => row.map(cell => cell === "0" ? "" : cell)));
        console.log("11111111111111111");
        console.log(puzzleArray);
        setCopyArray(puzzle.map(row => row.map(cell => cell === "0" ? "" : cell)));
        console.log("22222222222222222");
        console.log(copyArray);
      } catch (error) {
        alert("Something went wrong while fetching the Sudoku Question! See the console for details.");
      }
    }
    fetchData();
  }, []);

  const submit = async () => {
    const requestBody = puzzleArray
    const formData = new FormData();
    formData.append("difficulty", requiredDifficulty);
    const response2 = await api.put(`/sudoku/validation/${id}`, requestBody, formData);
    console.log(response2.data)
    console.log(typeof response2.data === 'boolean')
    if(response2.data === false){
      alert("The answer is not correct, please modify it");
    } else {
      history.push(`/SudokuGameWinPage`);
    }
  }

  let content = (
      puzzleArray.length === 0 ? (
        <Spinner />
      ) : (
        <div className="sudoku-grid" style={{left:'5vw', top:'5vw'}}>
          {puzzleArray.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cellValue, colIndex) => (
                <input
                  type="text"
                  className={`cell${copyArray[rowIndex][colIndex] !== "" ? " black-text" : " blue-text"}`}
                  key={colIndex}
                  value={cellValue}
                  readOnly={copyArray[rowIndex][colIndex] !== ""}
                  onChange={(event) => {
                    const updatedPuzzleArray = [...puzzleArray];
                    updatedPuzzleArray[rowIndex][colIndex] = event.target.value;
                    setPuzzleArray(updatedPuzzleArray);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )
  );

  return(
    <>
      <h2 className="select title" style={{left: 0}}>Sudoku Game</h2>
      <div>
        {content}
      </div>
      <button
        className="select button"
        style={{ backgroundColor: "rgb(57, 102, 161)", color: "rgb(214, 222, 235)", left: "60vw", top: "-26vw" }}
          onClick={() => submit()}>
        Submit
      </button>
      <button
        className="select button"
        style={{ backgroundColor: "rgb(57, 102, 161)", color: "rgb(214, 222, 235)", left: "60vw", top: "-20vw" }}
        onClick={() => history.push('/platform')}>
        Back
      </button>
    </>
  );
}

export default SudokuGamePage;