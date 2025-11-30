"""
Redis service for session-based data storage.
Manages temporary storage of timeline data with automatic expiration.
"""
import json
import redis
from typing import List, Optional
from uuid import UUID
from app.config import settings
from app.models.schemas import StoredWorkItem


class RedisService:
    """Service for managing Redis operations."""
    
    def __init__(self):
        """Initialize Redis connection pool."""
        self.redis_client = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            db=settings.redis_db,
            password=settings.redis_password if settings.redis_password else None,
            decode_responses=True,  # Automatically decode bytes to strings
            socket_connect_timeout=5,
            socket_timeout=5
        )
    
    def ping(self) -> bool:
        """
        Test Redis connection.
        
        Returns:
            True if connection is successful, False otherwise
        """
        try:
            return self.redis_client.ping()
        except redis.ConnectionError:
            return False
    
    def save_session_data(
        self, 
        session_id: str, 
        works: List[StoredWorkItem]
    ) -> bool:
        """
        Save timeline data to Redis with TTL.
        
        Args:
            session_id: Unique session identifier
            works: List of StoredWorkItem objects to save
            
        Returns:
            True if save was successful
            
        Raises:
            redis.RedisError: If Redis operation fails
        """
        try:
            # Serialize works to JSON
            works_data = [work.model_dump(mode='json') for work in works]
            json_data = json.dumps(works_data)
            
            # Save to Redis with TTL
            self.redis_client.setex(
                name=f"session:{session_id}",
                time=settings.session_ttl_seconds,
                value=json_data
            )
            return True
            
        except redis.RedisError as e:
            raise redis.RedisError(f"Failed to save session data: {str(e)}")
    
    def get_session_data(self, session_id: str) -> Optional[List[StoredWorkItem]]:
        """
        Retrieve timeline data from Redis.
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            List of StoredWorkItem objects or None if session not found
            
        Raises:
            redis.RedisError: If Redis operation fails
            ValueError: If stored data is corrupted
        """
        try:
            # Get data from Redis
            json_data = self.redis_client.get(f"session:{session_id}")
            
            if json_data is None:
                return None
            
            # Parse JSON
            try:
                works_data = json.loads(json_data)
            except json.JSONDecodeError as e:
                raise ValueError(f"Corrupted session data: {str(e)}")
            
            # Convert to Pydantic models
            works = []
            for work_data in works_data:
                # Convert string UUID back to UUID object
                if 'id' in work_data and isinstance(work_data['id'], str):
                    work_data['id'] = UUID(work_data['id'])
                works.append(StoredWorkItem(**work_data))
            
            return works
            
        except redis.RedisError as e:
            raise redis.RedisError(f"Failed to retrieve session data: {str(e)}")
    
    def delete_session_data(self, session_id: str) -> bool:
        """
        Delete session data from Redis.
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            True if deletion was successful
        """
        try:
            self.redis_client.delete(f"session:{session_id}")
            return True
        except redis.RedisError:
            return False
    
    def refresh_session_ttl(self, session_id: str) -> bool:
        """
        Reset the TTL for a session.
        
        Args:
            session_id: Unique session identifier
            
        Returns:
            True if TTL was refreshed successfully
        """
        try:
            return self.redis_client.expire(
                f"session:{session_id}",
                settings.session_ttl_seconds
            )
        except redis.RedisError:
            return False


# Global Redis service instance
redis_service = RedisService()
