function appraisalByIdPipeline($appraisalId) {
    retrun[
      ({
        $match: {
          appraisalId: $appraisalId,
        },
      },
      {})
    ];
  }
  
  module.exports = {
    appraisalByIdPipeline,
  };
  