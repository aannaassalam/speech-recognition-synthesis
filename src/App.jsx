import "./App.css";
import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Container,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import { createApi } from "unsplash-js";
import { useEffect, useState } from "react";
import data from "./assets/mock.json";
import CloseIcon from "@mui/icons-material/Close";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 50px 0;

  .searchbar {
    background-color: #eee;
    color: #333;
    border-radius: 30px;
    width: 70%;
    padding: 5px;
    align-self: center;

    .MuiInputBase-root {
      font-size: 14px;
      .MuiOutlinedInput-notchedOutline {
        border-color: transparent;
      }
    }

    .MuiIconButton-root {
      margin-right: 10px;
    }

    .MuiButton-contained {
      border-radius: 20px;
      font-size: 14px;
      text-transform: none;
      padding-inline: 20px;
    }
  }
  .cards {
    margin-top: 100px;
    .card {
      width: 200px;
      padding: 10px;
      border-radius: 5px;
      /* background-color: ; */
      border: 1px solid #f0f0f050;
      img {
        width: 100%;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      p {
        margin-bottom: 5px;
      }
    }
  }
`;

function App() {
  const [photos, setPhotos] = useState([]);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    },
  });

  const { speak, voices } = useSpeechSynthesis();

  const unsplash = createApi({
    accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
  });

  useEffect(() => {
    unsplash.photos
      .getRandom({
        count: 20,
        orientation: "squarish",
      })
      .then((res) => setPhotos(res.response))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container fixed>
      <StyledBox>
        <Stack direction="row" className="searchbar">
          <TextField
            variant="outlined"
            placeholder="Type or press the mic button speak...."
            size="small"
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {(Boolean(search) || Boolean(value)) && (
            <IconButton
              size="small"
              onClick={() => {
                setSearch("");
                setValue("");
                stop();
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => {
              listening ? stop() : listen();
            }}
            sx={{
              backgroundColor: listening ? "#FF5733" : "transparent",
              color: listening ? "#fff" : null,
              "&:hover": {
                backgroundColor: listening ? "#FF5733" : null,
              },
            }}
          >
            <MicIcon />
          </IconButton>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setSearch(value);
              stop();
              const length = data.filter(
                (_data) =>
                  _data.name.toLowerCase().includes(value.toLowerCase()) ||
                  _data.country.toLowerCase().includes(value.toLowerCase())
              ).length;
              speak({
                text: `Found ${length} result${
                  length > 1 ? "s" : ""
                }, based on your search`,
              });
            }}
          >
            Search
          </Button>
        </Stack>
        <Stack
          direction="row"
          gap={10}
          flexWrap="wrap"
          className="cards"
          justifyContent="center"
        >
          {photos.length &&
            data
              ?.filter(
                (_data) =>
                  _data.name.toLowerCase().includes(search.toLowerCase()) ||
                  _data.country.toLowerCase().includes(search.toLowerCase())
              )
              .map((_data) => {
                const _photo = photos[_data.id];

                return (
                  <Box className="card" key={_photo.id}>
                    <img
                      src={_photo.urls.regular}
                      alt={_photo.description}
                      key={_photo.id}
                    />
                    <Typography>{_data.name}</Typography>
                    <Typography>{_data.country}</Typography>
                  </Box>
                );
              })}
        </Stack>
      </StyledBox>
    </Container>
  );
}

export default App;
