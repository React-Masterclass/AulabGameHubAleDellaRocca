import Review from "./Review.jsx";
import Typography from "@mui/material/Typography";
import {Container} from "@mui/material";

function Reviews({ review, game}) {

    return (
        <Container sx={{mt:5}}>
            <Typography variant={"h4"}>{game.name} Reviews</Typography>
            {review && review.length !== 0 ?
                review.map((review) => (
                   <Review key={review.id} review={review}></Review>
                )): (
                    <Typography variant={"subtitle1"}>No reviews have been published yet.</Typography>
                )}
        </Container>
    );
}

export default Reviews;

