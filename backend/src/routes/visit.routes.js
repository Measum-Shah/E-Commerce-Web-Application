import express from "express";
import Visit from "../models/Visit.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

const router = express.Router();

/* ─────────────────────────────────────────
   POST /api/visits/track
   Public — called by frontend on page load
───────────────────────────────────────── */
router.post("/track", async (req, res) => {
  try {
    // Respect session flag sent from frontend to avoid double-counting
    const ip =
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    // Skip loopback / local dev IPs — ip-api won't resolve them anyway
    const isLocal =
      ip === "unknown" ||
      ip === "::1" ||
      ip.startsWith("127.") ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.");

    let city = null, region = null, country = null, lat = null, lon = null;

    if (!isLocal) {
      try {
        const geo = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country,lat,lon,status`)
          .then((r) => r.json());

        if (geo.status === "success") {
          city    = geo.city       || null;
          region  = geo.regionName || null;
          country = geo.country    || null;
          lat     = geo.lat        || null;
          lon     = geo.lon        || null;
        }
      } catch {
        // geo lookup failed — still record the visit without location
      }
    }

    await Visit.create({
      ip,
      city,
      region,
      country,
      lat,
      lon,
      userAgent: req.headers["user-agent"] || null,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/visits/stats
   Admin only — returns visit analytics
───────────────────────────────────────── */
router.get("/stats", protect, authorize(roles.ADMIN), async (req, res) => {
  try {
    const [
      totalVisits,
      uniqueIPs,
      recentVisits,
      topCities,
      topCountries,
      visitsByDay,
    ] = await Promise.all([
      // total page hits
      Visit.countDocuments(),

      // unique visitors by IP
      Visit.distinct("ip").then((ips) => ips.length),

      // last 50 visits for the table
      Visit.find()
        .sort({ timestamp: -1 })
        .limit(50)
        .select("ip city region country lat lon userAgent timestamp"),

      // top 10 cities
      Visit.aggregate([
        { $match: { city: { $ne: null } } },
        { $group: { _id: "$city", country: { $first: "$country" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // top 10 countries
      Visit.aggregate([
        { $match: { country: { $ne: null } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // visits per day for last 30 days (for a chart)
      Visit.aggregate([
        {
          $match: {
            timestamp: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        uniqueVisitors: uniqueIPs,
        recentVisits,
        topCities,
        topCountries,
        visitsByDay,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;