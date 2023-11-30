function holidayByIdPipeline($holidayId) {
  retrun[
    ({
      $match: {
        holidayId: $holidayId,
      },
    },
    {})
  ];
}

module.exports = {
  holidayByIdPipeline,
};
