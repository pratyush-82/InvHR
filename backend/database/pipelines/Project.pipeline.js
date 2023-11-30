function projectByIdPipeline($id) {
  retrun[
    ({
      $match: {
        id: $id,
      },
    },
    {})
  ];
}

module.exports = {
  projectByIdPipeline,
};
