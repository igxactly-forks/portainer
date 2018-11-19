function ExtensionViewModel(data) {
  this.Id = data.Id;
  this.Name = data.Name;
  this.Enabled = data.Enabled;
  this.Description = data.Description;
  this.Price = data.Price;
  // TODO: mockup
  this.PriceDescription = 'Price per instance per month';
  this.Deal = data.Deal;
  this.ShortDescription = data.ShortDescription;
  this.LicenseCompany = data.LicenseCompany;
  this.LicenseExpiration = data.LicenseExpiration;
  this.Version = data.Version;
  this.UpdateAvailable = data.UpdateAvailable;
}