import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockUserProfile } from '@/tests/utils/test-utils';
import { ProfileEditModal } from '../components/ProfileEditModal';

describe('ProfileEditModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSave.mockResolvedValue(undefined);
  });

  it('renders modal when open', () => {
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Profil')).toBeInTheDocument();
    expect(screen.getByText('Perbarui informasi profil Anda di bawah ini')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ProfileEditModal
        isOpen={false}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText('Edit Profil')).not.toBeInTheDocument();
  });

  it('populates form with profile data', () => {
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+62 812 3456 7890')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    // Clear required fields
    const firstNameInput = screen.getByDisplayValue('John');
    await user.clear(firstNameInput);

    const lastNameInput = screen.getByDisplayValue('Doe');
    await user.clear(lastNameInput);

    // Try to submit
    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(screen.getByText('Nama depan wajib diisi')).toBeInTheDocument();
      expect(screen.getByText('Nama belakang wajib diisi')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');

    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(screen.getByText('Format email tidak valid')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    const phoneInput = screen.getByDisplayValue('+62 812 3456 7890');
    await user.clear(phoneInput);
    await user.type(phoneInput, 'invalid-phone');

    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(screen.getByText('Format nomor telepon tidak valid')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    const bioInput = screen.getByPlaceholderText('Ceritakan sedikit tentang diri Anda...');
    await user.type(bioInput, 'Updated bio');

    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          bio: 'Test user bioUpdated bio',
        })
      );
    });
  });

  it('closes modal on cancel', async () => {
    const user = userEvent.setup();
    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByText('Batal'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles save error gracefully', async () => {
    const user = userEvent.setup();
    mockOnSave.mockRejectedValue(new Error('Save failed'));

    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByText('Simpan Perubahan'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });

    // Modal should still be open after error
    expect(screen.getByText('Edit Profil')).toBeInTheDocument();
  });

  it('shows loading state during save', async () => {
    const user = userEvent.setup();
    let resolvePromise: () => void;
    const savePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
    mockOnSave.mockReturnValue(savePromise);

    render(
      <ProfileEditModal
        isOpen={true}
        onClose={mockOnClose}
        profile={mockUserProfile}
        onSave={mockOnSave}
      />
    );

    await user.click(screen.getByText('Simpan Perubahan'));

    // Should show loading state
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeDisabled();

    // Resolve the promise
    resolvePromise!();
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});