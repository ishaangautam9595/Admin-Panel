import { Card } from "semantic-ui-react";
import { AppType } from "../constants/enum";
import React from "react";

const Cards = (props : {items : AppType}) => {
  return (
    <>
        <Card
          header={props.items.title}
          description={props.items.description}
        />
    </>
  );
};

export default Cards;
