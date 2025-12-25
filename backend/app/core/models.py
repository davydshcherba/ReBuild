from .database import Base 
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Date
from datetime import date


class ExerciseModel(Base):
    __tablename__ = "exercises"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(nullable=False)
    group: Mapped[str] = mapped_column(nullable=False)
    exercise_date: Mapped[date] = mapped_column(Date, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped["UserModel"] = relationship(back_populates="exercises")


class UserModel(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    exercises: Mapped[list["ExerciseModel"]] = relationship(
        back_populates="user", 
        cascade="all, delete-orphan"
    )