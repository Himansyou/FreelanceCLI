package org.freelance.tracking.dto;

/**
 * Response after sync: count of synced and rejected.
 */
public class SyncResponse {

    private int synced;
    private int rejected;
    private String message = "OK";

    public SyncResponse(int synced, int rejected) {
        this.synced = synced;
        this.rejected = rejected;
    }

    public int getSynced() { return synced; }
    public void setSynced(int synced) { this.synced = synced; }
    public int getRejected() { return rejected; }
    public void setRejected(int rejected) { this.rejected = rejected; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
