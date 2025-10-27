import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCategoriesByLevelQuery } from "../../Store/Api/admin/category";
import { NotFound } from "../../Pages/User";
import stringSimilarity from "string-similarity";

const RouteValidation = ({ children }) => {
  const { category, subCategory, thirdCategory } = useParams();
  const navigate = useNavigate();

  let { data: subCats, isLoading: isSubCatLoading } =
    useGetCategoriesByLevelQuery({ level: "second" });
  let { data: rootCats, isLoading: isRootCatLoading } =
    useGetCategoriesByLevelQuery({ level: "first" });
  let { data: thirdCats, isLoading: isThirdCatLoading } =
    useGetCategoriesByLevelQuery({ level: "third" });

  if (isRootCatLoading || isSubCatLoading || isThirdCatLoading) {
    return <h1>Loading...</h1>;
  }
  console.log(subCats.categories);
  const findClosestMatch = (cats, param) => {
    const names = cats.categories.map((c) => c.name.toLowerCase());
    const match = stringSimilarity.findBestMatch(param, names);
    if (match.bestMatch.rating > 0.4) {
      return match.bestMatch.target;
    }
    return null;
  };

  if (category && subCategory && thirdCategory) {
    const rootMatch = findClosestMatch(rootCats, category);
    const subMatch = findClosestMatch(subCats, subCategory);
    const thirdMatch = findClosestMatch(thirdCats, thirdCategory);

    if (!rootMatch || !subMatch || !thirdMatch) {
      return <NotFound />;
    }

    if (
      rootMatch.toLowerCase() !== category.toLowerCase() ||
      subMatch.toLowerCase() !== subCategory.toLowerCase() ||
      thirdMatch.toLowerCase() !== thirdCategory.toLowerCase()
    ) {
      navigate(
        `/${rootMatch.toLowerCase()}/${subMatch.toLowerCase()}/${thirdMatch.toLowerCase()}`,
        { replace: true }
      );
      return null;
    }
  } else if (category && subCategory) {
    const rootMatch = findClosestMatch(rootCats, category);
    const subMatch = findClosestMatch(subCats, subCategory);

    if (!rootMatch || !subMatch) {
      return <NotFound />;
    }

    if (
      rootMatch.toLowerCase() !== category.toLowerCase() ||
      subMatch.toLowerCase() !== subCategory.toLowerCase()
    ) {
      navigate(`/${rootMatch.toLowerCase()}/${subMatch.toLowerCase()}`, {
        replace: true,
      });
      return null;
    }
  } else if (category) {
    const rootMatch = findClosestMatch(rootCats, category);

    if (!rootMatch) {
      return <NotFound />;
    }

    if (rootMatch.toLowerCase() !== category.toLowerCase()) {
      navigate(`/${rootMatch.toLowerCase()}`, { replace: true });
      return null;
    }
  }

  return children;
};

export default RouteValidation;
