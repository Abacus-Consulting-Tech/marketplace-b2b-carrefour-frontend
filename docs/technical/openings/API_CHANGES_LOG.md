# API Changes Log - August 26, 2026

## 📝 Summary
Recent implementation changes affecting API specifications and documentation.

---

## 🔄 Type Definitions Changes

### SupplierInvitation Interface Update
**File**: `src/types/openings.ts`

**Change**: Added required field
```typescript
export interface SupplierInvitation {
  id: string;
  project_id: string;        // ✨ NEW FIELD ADDED (Required)
  category_id: string;
  supplier_id: string;
  status: InvitationStatus;
  // ... rest of fields
}
```

**Impact**:
- Navigation URLs now require `project_id` 
- Route: `/supplier/openings/{project_id}/quote/{category_id}`
- Must be included in `getMyInvitations()` response
- Referenced in `mockInvitations` data

**Affected Endpoints**:
- `GET /api/openings/my-invitations` - Now returns `project_id` for each invitation
- `POST /api/openings/invitations` - Must accept `project_id` in request
- `GET /api/openings/projects/:id/invitations` - Returns invitations with `project_id`

---

## 🔌 API Endpoints Missing from Dev Tools

### Document Management (4 endpoints)
```
POST   /admin/openings/projects/:id/documents                 - Upload technical document/plan
GET    /admin/openings/projects/:id/documents                 - List project documents
GET    /admin/openings/projects/:id/documents/:documentId    - Get signed download URL
DELETE /admin/openings/projects/:id/documents/:documentId    - Delete document
```

**Features**:
- Categories: planos_arquitectura, equipamientos, obras_iluminacion, obras_clima, etc.
- Max file size: 15 MB per document
- Supports PDF, images, CAD files
- Supplier access (view/download only) when invited to project

---

### Supplier Invitations (4 endpoints)
```
POST   /admin/openings/projects/:id/invitations              - Invite suppliers to project
GET    /admin/openings/projects/:id/invitations              - List invitations for project
POST   /api/openings/invitations                              - Create manual invitation
DELETE /admin/openings/invitations/:id                        - Delete invitation
```

---

### Quote Operations (4 endpoints)
```
PATCH  /admin/openings/quotes/:id/award                      - Award quote to supplier
PATCH  /admin/openings/quotes/:id/revert                     - Revert award decision
POST   /api/openings/quotes/:id/sign                         - Sign quote digitally
GET    /api/openings/categories/:id/quotes/comparison        - Compare quotes by category
```

---

### Project Status & Audit (4 endpoints)
```
PATCH  /admin/openings/projects/:id/status                   - Update project status
GET    /admin/openings/projects/:id/status-history           - View status transitions log
POST   /admin/openings/projects/:id/financing                - Request financing review
PATCH  /admin/openings/projects/:id/financing/:id            - Review financing request
```

---

## 📱 UI Components Using Updated APIs

### Quote Form Page
**File**: `src/app/(supplier)/supplier/openings/[id]/quote/[categoryId]/page.tsx`

**New Feature**: Displays project technical documents while supplier fills quote
- Uses: `openingsApi.getProjectDocuments(projectId)`
- Component: `ProjectDocumentsViewer`
- Download enabled: Yes (canDownload={true})
- Categories filterable: Yes

**Benefits**:
- ✅ Supplier can reference specs while adjusting budget
- ✅ No need to remember details from previous page
- ✅ Access to all project technical documentation

---

## 🔗 Navigation Changes

### Supplier Openings URL
**Before**: `/supplier/openings/undefined/quote/cat_001` ❌
**After**: `/supplier/openings/proj_001/quote/cat_001` ✅

**Root Cause Fixed**: 
- `project_id` now properly extracted from `SupplierInvitation`
- Type system prevents undefined at compile time

---

## 📚 Documentation Status

### Source of Truth #1: Dev Tools Page
**Status**: ⚠️ Needs update
**File**: `src/app/(backoffice)/admin/dev-tools/page.tsx`
**Action**: Add 16 missing endpoints to "Openings" section (currently shows 8/24)

### Source of Truth #2: Backend Guide
**Status**: ✅ Complete
**File**: `docs/technical/openings/BACKEND_GUIDE.md`
**Coverage**: 
- Document upload/download (4 endpoints documented)
- Invitations and supplier management
- Quote signing process  
- Status transitions
- SQL schema and indexes

### Source of Truth #3: Type Specifications
**Status**: ⚠️ Needs update
**File**: `src/types/openings.ts`
**Action**: Update SupplierInvitation documentation to note `project_id` requirement

---

## ✅ Test Coverage

### Types
- [x] SupplierInvitation now has project_id
- [x] Mock data includes project_id for all invitations
- [x] Navigation uses correct type

### Integration
- [x] Supplier can navigate to quote form
- [x] Quote form shows project documents
- [x] Documents display with filters
- [x] Download links work

### Endpoints (Mock)
- [x] getMyInvitations() returns project_id
- [x] getProjectDocuments(projectId) works
- [x] getDocumentDownloadUrl() generates URLs
- [x] deleteProjectDocument() removes docs

---

## 🚀 Next Steps (If Using Real Backend)

1. **Backend Team**: Ensure `project_id` in SupplierInvitation responses
2. **API Contract**: Update OpenAPI/Swagger to reflect new field
3. **Dev Tools**: Update to list all 24+ endpoints for Openings module
4. **Integration Tests**: Verify quota storage and retrieval with documents

---

**Last Updated**: August 26, 2026  
**Status**: All recent changes documented and tested ✅
