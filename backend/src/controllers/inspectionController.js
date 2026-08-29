import { Inspection } from "../models/Inspection.js";


export const createInspection = async (req, res) => {
  try {
    const inspectionData = req.body;

    // Attach the authenticated user's ID as the inspector
    inspectionData.inspectorId = req.user._id;
    // Map frontend 'id' to backend 'inspectionId' if present
    if (inspectionData.id) {
      inspectionData.inspectionId = inspectionData.id;
    }

    // The frontend sends benchOrLevel nested inside geoTag,
    // but the schema requires it as a top-level field. Normalize it here.
    if (!inspectionData.benchOrLevel && inspectionData.geoTag?.benchOrLevel) {
      inspectionData.benchOrLevel = inspectionData.geoTag.benchOrLevel;
    }

    const inspection = await Inspection.create(inspectionData);

    res.status(201).json({
      success: true,
      data: inspection,
    });
  } catch (error) {
    console.error("Error creating inspection:", error);
    res.status(500).json({
      success: false,
      error: "Server Error: Could not create inspection",
    });
  }
};

// @desc    Get all inspections (for admins/mine officials)
// @route   GET /api/inspections
// @access  Private (mine_official, CIL_HQ)
export const getInspections = async (req, res) => {
  try {
    const query = {};
    
    // If the user is assigned to a specific subsidiary/mine, we could filter here, 
    // but for now we'll allow fetching all if they have the right role, 
    // or filter based on req.query.mineId
    if (req.query.mineId) {
      query.mineId = req.query.mineId;
    }

    const inspections = await Inspection.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (error) {
    console.error("Error fetching inspections:", error);
    res.status(500).json({
      success: false,
      error: "Server Error: Could not fetch inspections",
    });
  }
};

// @desc    Get inspections for the authenticated inspector's mine
// @route   GET /api/inspections/mine
// @access  Private (safety_officer)
export const getMyMineInspections = async (req, res) => {
  try {
    // We assume the safety_officer user object has the 'subsidiary' or we can rely on a query param
    // But since the requirement says "only see their records", we can filter by inspectorId,
    // or by the mine they are assigned to. We will filter by inspectorId for now.
    const inspections = await Inspection.find({ inspectorId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections,
    });
  } catch (error) {
    console.error("Error fetching mine inspections:", error);
    res.status(500).json({
      success: false,
      error: "Server Error: Could not fetch mine inspections",
    });
  }
};

// @desc    Get single inspection by ID
// @route   GET /api/inspections/:id
// @access  Private
export const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);

    if (!inspection) {
      return res.status(404).json({
        success: false,
        error: "Inspection not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inspection,
    });
  } catch (error) {
    console.error("Error fetching inspection:", error);
    res.status(500).json({
      success: false,
      error: "Server Error: Could not fetch inspection",
    });
  }
};
