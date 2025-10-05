// Simple toast service for development
// TODO: Replace with proper toast library like sonner or react-hot-toast

export const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message);
    // You can replace this with actual toast implementation
    alert(`✅ ${message}`);
  },
  
  error: (message: string) => {
    console.error('❌ Error:', message);
    // You can replace this with actual toast implementation
    alert(`❌ ${message}`);
  },
  
  info: (message: string) => {
    console.log('ℹ️ Info:', message);
    // You can replace this with actual toast implementation
    alert(`ℹ️ ${message}`);
  },
  
  warning: (message: string) => {
    console.warn('⚠️ Warning:', message);
    // You can replace this with actual toast implementation
    alert(`⚠️ ${message}`);
  },
};