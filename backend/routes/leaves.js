/**
 * Leave Management Routes
 * Handles all leave-related API endpoints
 * - Apply for leave (Employee)
 * - View own requests (Employee)
 * - Get statistics (Employee)
 * - Cancel requests (Employee)
 * - View pending requests (Manager)
 * - Approve/Reject requests (Manager)
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Leave = require('../models/Leave');
const User = require('../models/User');

// Apply leave
router.post('/', auth, async (req,res)=>{
  try {
    const {leaveType,startDate,endDate,reason,totalDays} = req.body;
    
    // Validation
    if (!leaveType || !startDate || !endDate || !totalDays) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (totalDays <= 0) {
      return res.status(400).json({ error: 'Total days must be greater than 0' });
    }
    
    console.log('Creating leave request for user:', req.user.id);
    const l = await Leave.create({ 
      userId: req.user.id, 
      leaveType, 
      startDate, 
      endDate, 
      reason: reason || '', 
      totalDays
    });
    
    console.log('Leave request created:', l._id);
    res.json(l);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(400).json({ error: error.message || 'Failed to create leave request' });
  }
});

// My requests
router.get('/my-requests', auth, async (req,res)=>{
  try {
    const leaves = await Leave.find({userId: req.user.id}).sort('-createdAt');
    res.json(leaves);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get leave statistics
router.get('/statistics', auth, async (req,res)=>{
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const leaves = await Leave.find({userId: req.user.id});
    
    let totalApplied = 0;
    let totalApproved = 0;
    let totalRejected = 0;
    let totalPending = 0;
    
    leaves.forEach(leave => {
      totalApplied += leave.totalDays || 0;
      if (leave.status === 'approved') {
        totalApproved += leave.totalDays || 0;
      } else if (leave.status === 'rejected') {
        totalRejected += leave.totalDays || 0;
      } else if (leave.status === 'pending') {
        totalPending += leave.totalDays || 0;
      }
    });
    
    res.json({
      totalApplied,
      totalApproved,
      totalRejected,
      totalPending,
      totalRequests: leaves.length
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leave statistics' });
  }
});

// Cancel
router.delete('/:id', auth, async (req,res)=>{
  try {
    const l = await Leave.findById(req.params.id);
    if(!l) return res.status(404).json({error:'Leave request not found'});
    if(l.userId.toString() !== req.user.id) return res.status(403).json({error:'Forbidden'});
    
    await Leave.findByIdAndDelete(req.params.id);
    res.json({msg:'Leave request cancelled successfully'});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Manager - pending
router.get('/pending', auth, async (req,res)=>{
  if(req.user.role !== 'manager') return res.status(403).send('forbidden');
  const pending = await Leave.find({status:'pending'}).populate('userId','name email');
  res.json(pending);
});

// Approve
router.put('/:id/approve', auth, async (req,res)=>{
  try {
    if(req.user.role !== 'manager') return res.status(403).json({error:'Forbidden'});
    
    const l = await Leave.findById(req.params.id);
    if(!l) return res.status(404).json({error:'Leave request not found'});
    
    if(l.status !== 'pending') {
      return res.status(400).json({error:'Leave request is not pending'});
    }
    
    l.status = 'approved';
    await l.save();
    res.json(l);
  } catch (error) {
    console.error('Error approving leave:', error);
    res.status(400).json({ error: error.message || 'Failed to approve leave request' });
  }
});

// Reject
router.put('/:id/reject', auth, async (req,res)=>{
  try {
    if(req.user.role !== 'manager') return res.status(403).json({error:'Forbidden'});
    
    const l = await Leave.findById(req.params.id);
    if(!l) return res.status(404).json({error:'Leave request not found'});
    
    if(l.status !== 'pending') {
      return res.status(400).json({error:'Leave request is not pending'});
    }
    
    l.status = 'rejected';
    await l.save();
    res.json(l);
  } catch (error) {
    console.error('Error rejecting leave:', error);
    res.status(400).json({ error: error.message || 'Failed to reject leave request' });
  }
});

module.exports = router;
