import Review from "./Review.jsx";

function Reviews({ review, game}) {

    return (
        <div>
            <h4>{game.name} Reviews</h4>
            {review &&
                review.map((review) => (
                   <Review key={review.id} review={review}></Review>
                ))}
        </div>
    );
}

export default Reviews;

