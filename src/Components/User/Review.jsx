import Rating from "@mui/material/Rating";
import React from "react";
import { userPlaceHolder } from "../../Assets";

const Review = ({ review }) => {
  return (
    <div className=" w-full border-b-1 border-[rgba(0,0,0,0.1)] mb-5">
      <div className="flex items-center justify-between">
        <div className="col1 flex gap-3 items-center">
          <div className="img w-[40px] h-[40px] rounded-full overflow-hidden">
            <img
              src={review.user.image || userPlaceHolder}
              className="w-full"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[13px]">{review.user.name}</h4>
            <h6 className="text-[12px]">
              {new Date(review?.createdAt).toLocaleDateString()}
            </h6>
          </div>
        </div>
        <div className="col2">
          <Rating
            name="size-small"
            defaultValue={review.rating}
            size="small"
            readOnly
          />
        </div>
      </div>
      <p className="!mt-2 ">{review.review}</p>
    </div>
  );
};

export default Review;
