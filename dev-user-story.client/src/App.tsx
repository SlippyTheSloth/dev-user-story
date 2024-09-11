import { ChangeEvent, FormEvent, useState } from "react";
import {
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageListItem
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import vegeta from "./assets/vegeta.png";
import "./App.css";

function App() {
  // static constants
  const num: Array<string> =
    "Zero One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen".split(
      " "
    );
  const tens: Array<string> =
    "Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety".split(" ");

  // constants that track state
  const [numList, setNumList] = useState("");
  const [output, setOutput] = useState(Array<string>);

  // constant functions for updating state
  const handleFormChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    console.log(`handleFormChange: ${event.target.value}`);
    setNumList(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const updateOutput = (list: Array<string>): void => {
    console.log(`updateOutput: ${list}`);
    setOutput(list);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 id="tableLabel">Alphabetical Sorting</h1>
      <p>
        Enter a list of comma separated numbers, click "Sort Text", and it'll be
        converted to alphabetically sorted text!
      </p>
      <form
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Enter numbers"
          name="numbers"
          onChange={handleFormChange}
        />
        <Button
          sx={{ m: 2 }}
          size="large"
          variant="contained"
          type="submit"
          onClick={() => {
            parseNumList(numList);
          }}
        >
          Sort Text
        </Button>
      </form>
      <List>
        {output.map((output, index) => {
          return (
            <ListItem key={index}>
              <ListItemIcon>
                <CircleIcon />
              </ListItemIcon>
              {output.includes("OVER 9000") ? (
                <ImageListItem sx={{ width: 500 }}>
                  <img src={vegeta} title={output} loading="lazy" />
                </ImageListItem>
              ) : (
                <ListItemText primary={output} />
              )}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // Handles the output of errors, even if they aren't Error types
  function handleError(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified = "[Unable to stringify the thrown value]";
    try {
      stringified = JSON.stringify(value);
    } catch {}

    const error = new Error(
      `This value was thrown as is, not through an Error: ${stringified}`
    );
    return error;
  }

  // Takes the user's input, converts it to a list of numbers, processes them using numberToWords, and updates the output
  function parseNumList(numList: string): void {
    const splitList = numList.split(",");
    splitList.forEach((value, index) => {
      try {
        splitList[index] = numberToWords(Number(value));
      } catch (err) {
        const error = handleError(err);
        console.log(error.message);
        alert(
          "The input '" +
            splitList[index] +
            "' is not valid. Please only use whole numbers separated by commas. For example: 1,2,3,11,8999,16"
        );
        return;
      }
    }, splitList);
    splitList.sort((a, b) => b.localeCompare(a)).reverse();
    updateOutput(splitList);
  }

  // Recursively converts a number to the written equivalent
  function numberToWords(n: number): string {
    if (n % 1 != 0) throw Error(); // Error out if number is a decimal
    if (n < 0) return "Negative " + numberToWords(n * -1);
    if (n < 20) return num[n];
    const digit = n % 10;
    if (n < 100) return tens[~~(n / 10) - 2] + (digit ? "-" + num[digit] : "");
    if (n < 1000)
      return (
        num[~~(n / 100)] +
        " Hundred" +
        (n % 100 == 0 ? "" : " and " + numberToWords(n % 100))
      );
    if (n <= 9000)
      return (
        numberToWords(~~(n / 1000)) +
        " Thousand" +
        (n % 1000 != 0 ? " " + numberToWords(n % 1000) : "")
      );
    else
      return (
        numberToWords(~~(n / 1000)) +
        " Thousand" +
        (n % 1000 != 0 ? " " + numberToWords(n % 1000) : "") +
        " IS OVER 9000!!!"
      );
  }
}

export default App;
