import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')
    const awb = searchParams.get('awb')

    if (!phone && !awb) {
      return NextResponse.json(
        { success: false, message: 'Phone Number or AWB Number is required' },
        { status: 400 }
      )
    }

    let query = {}
    
    // Build query based on provided parameters
    if (awb) {
      // Search by AWB/tracking number
      query.trackingId = awb.trim()
    } else if (phone) {
      // Search by phone number in shipping address
      query['shippingAddress.phone'] = phone.trim()
    }

    // Find order by phone or AWB
    const order = await Order.findOne(query)
      .populate('orderItems.productId')
      .sort({ createdAt: -1 }) // Get most recent if multiple orders
      .lean()

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found with the provided information' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Track order error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to track order' },
      { status: 500 }
    )
  }
}
