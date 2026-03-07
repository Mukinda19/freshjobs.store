export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://freshjobs.store/scripts/fetch-jobs.js"
    );

    return res.status(200).json({
      success: true,
      message: "Cron triggered"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });

  }

}