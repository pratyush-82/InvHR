function empByIdPipeline(query) {
  return [
    {
      $match: {
        ...query,
      },
    },
    {
      $lookup: {
        from: "designations",
        localField: "designation",
        foreignField: "id",
        as: "designationDetails",
      },
    },
    {
      $addFields: {
        permissions: {
          $first: "$designationDetails.permission",
        },
      },
    },
  ];
}

module.exports = {
  empByIdPipeline,
};
